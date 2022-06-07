import { emojify } from 'node-emoji'

type ContentType =
    | [name: 'title', size: number, id?: string]
    | [name: 'text']
    | [name: 'block-quote']
    | [name: 'unordered-list', indent: number]
    | [name: 'ordered-list', isIndented: boolean]
    | [name: 'horizontal-rule']
    | [name: 'table-header']
    | [name: 'table-divider', alignment: ('left' | 'center' | 'right')[]]
    | [name: 'table-row']
    | [name: 'table-cell']
    | [name: 'code-block-start', format: string]
    | [name: 'code-block-line']
    | [name: 'code-block-end']
    | [name: 'defined-term']
    | [name: 'definition']
    | [name: 'task-list', indent: number, isChecked: boolean]
    | [name: 'regular-text']
    | [name: 'bold-text']
    | [name: 'italic-text']
    | [name: 'highlight']
    | [name: 'code']
    | [name: 'strikethrough']
    | [name: 'subscript']
    | [name: 'superscript']
    | [name: 'link', url: string, title?: string]
    | [name: 'image', url: string, title?: string]
    | [name: 'footnote-definition', name: string]

class ParsedMdObj {
    constructor(
        public type: ContentType,
        public content: ParsedMdObj[] | string
    ) {}
}

export const markdownToJson = (markdown: string): ParsedMdObj[] => {
    const lines = markdown.split('\n')

    let lastLineWasEmpty = false

    let result: ParsedMdObj[] = []
    let footnotes: ParsedMdObj[] = []
    mainLoop: for (const line of lines) {
        const titleRegex = /^ {0,3}(?<hashtags>#{1,}) (?<content>.+) *$/
        const titleMatch = titleRegex.exec(line)
        if (titleMatch) {
            const hashtagsCount = titleMatch.groups.hashtags.length
            let titleContent = titleMatch.groups.content
            let titleId = undefined

            const titleIdRegex = /\{#(?<content>.+)\} *$/
            const titleIdMatch = titleIdRegex.exec(titleMatch.groups.content)
            if (titleIdMatch) {
                titleContent = titleContent.replace(titleIdMatch[0], '')
                titleId = titleIdMatch.groups.content
            }

            result.push(
                new ParsedMdObj(['title', hashtagsCount, titleId], titleContent)
            )
            continue
        }

        const emptyLineRegex = /^[ \t]{0,}$/
        const emptyLineMatch = emptyLineRegex.exec(line)
        if (emptyLineMatch) {
            if (!lastLineWasEmpty) {
                result.push(new ParsedMdObj(['text'], ''))
            }

            lastLineWasEmpty = true
            continue
        } else {
            lastLineWasEmpty = false
        }

        const blockQuoteRegex = /^ {0,}> {0,}(?<content>.+)$/
        const blockQuoteMatch = blockQuoteRegex.exec(line)
        if (blockQuoteMatch) {
            result.push(
                new ParsedMdObj(['block-quote'], blockQuoteMatch.groups.content)
            )
            continue
        }

        const getIndentCount = (str: string): number => {
            const indentRegex = /(?: {2}|\t)/g
            const indentCount = (str.match(indentRegex) || []).length
            return indentCount
        }

        const horizontalRuleRegex = /^ {0,3}[*-_]{3,}$/
        const horizontalRuleMatch = horizontalRuleRegex.exec(line.trimEnd())
        if (horizontalRuleMatch) {
            result.push(new ParsedMdObj([`horizontal-rule`], ''))
            continue
        }

        const tableRowRegex = /^ {0,3}\|(?:[^|]+\|)+[ \t]{0,}$/
        const tableRowMatch = tableRowRegex.exec(line)
        if (tableRowMatch) {
            let cells = line
                .split('|')
                .slice(1, -1)
                .map(it => it.trim())

            const tableDividerRegex = /^(?<left>:)?-{1,}(?<right>:)?$/
            const tableCellsAfterRegex = cells.map(it =>
                tableDividerRegex.exec(it)
            )

            const lastType = result[result.length - 1]?.type[0] || null
            const isTableDivider =
                tableCellsAfterRegex.filter(cell => cell).length ==
                    cells.length && lastType == 'table-header'

            if (isTableDivider) {
                const alignments = tableCellsAfterRegex.map(regexResult => {
                    if (regexResult.groups.right) {
                        if (regexResult.groups.left) return 'center'
                        return 'right'
                    }

                    return 'left'
                })
                result.push(new ParsedMdObj([`table-divider`, alignments], ''))
                continue
            }

            if (lastType !== 'table-row' && lastType !== 'table-divider') {
                result.push(
                    new ParsedMdObj(
                        [
                            lastType !== 'table-header'
                                ? 'table-header'
                                : 'table-cell',
                        ],
                        cells.map(cell => new ParsedMdObj(['table-cell'], cell))
                    )
                )
                continue
            }

            result.push(
                new ParsedMdObj(
                    ['table-row'],
                    cells.map(cell => new ParsedMdObj(['table-cell'], cell))
                )
            )
            continue
        }

        const orderedListRegex = /^(?<indent>[ \t]{0,})[0-9]+. (?<content>.+)$/
        const orderedListMatch = orderedListRegex.exec(line)
        if (orderedListMatch) {
            const isIndented = !(
                orderedListMatch.groups.indent.length === 0 ||
                orderedListMatch.groups.indent === ' '
            )

            result.push(
                new ParsedMdObj(
                    [`ordered-list`, isIndented],
                    orderedListMatch.groups.content
                )
            )
            continue
        }

        const codeBlockRegex =
            /^ {0,3}```[ \t]{0,}(?<format>[^ \t]+)?[ \t]{0,}$/
        const codeBlockMatch = codeBlockRegex.exec(line)
        if (codeBlockMatch) {
            const format = codeBlockMatch.groups.format
            if (format) {
                let last = ''
                for (const r of result) {
                    if (r.type[0] == 'code-block-start')
                        last = 'code-block-start'
                    if (r.type[0] == 'code-block-end') last = 'code-block-end'
                }

                if (last == 'code-block-start') {
                    result.push(new ParsedMdObj(['code-block-line'], line))
                    continue
                }

                result.push(new ParsedMdObj(['code-block-start', format], ''))
                continue
            }

            let last = ''
            for (const r of result) {
                if (r.type[0] == 'code-block-start') last = 'code-block-start'
                if (r.type[0] == 'code-block-end') last = 'code-block-end'
            }

            if (last == 'code-block-start') {
                result.push(new ParsedMdObj(['code-block-end'], ''))
                continue
            }

            result.push(new ParsedMdObj(['code-block-start', 'txt'], ''))
            continue
        }

        let lastCodeResultType = ''
        for (let i = result.length - 1; i > -1; i--) {
            let type = result[i].type[0]
            if (type === 'code-block-line') {
                result.push(new ParsedMdObj(['code-block-line'], line))
                continue mainLoop
            }

            if (type == 'code-block-start' || type == 'code-block-end') {
                lastCodeResultType = type
                break
            }
        }

        if (lastCodeResultType == 'code-block-start') {
            result.push(new ParsedMdObj(['code-block-line'], line))
            continue
        }

        const definitionListRegex =
            /^(?<whitespace>\s+):(?:(?: {1,4})|\t)(?<content>.+)$/
        const definitionListMatch = definitionListRegex.exec(line)
        definitionListIf: if (definitionListMatch) {
            const whitespace = definitionListMatch.groups.whitespace
            let whitespaceCount = 0
            for (let i = 0; i < whitespace.length; i++) {
                whitespaceCount += whitespace[i] == '\t' ? 4 : 1
            }

            if (whitespaceCount < 3) break definitionListIf

            const content = definitionListMatch.groups.content.trimEnd()

            const lastType = result[result.length - 1]?.type[0] || null

            if (lastType == 'text' || lastType == 'definition') {
                if (lastType == 'text') {
                    result[result.length - 1].type[0] = 'defined-term'
                }

                result.push(new ParsedMdObj(['definition'], content))
                continue
            }
        }

        const taskListRegex =
            /^(?<indent> {0,})- {1,4}(?<checkbox>\[[x ]\])\s+(?<content>.+)$/
        const taskListMatch = taskListRegex.exec(line)
        taskListIf: if (taskListMatch) {
            const { content, indent, checkbox } = taskListMatch.groups

            let actualIndent = Math.floor(indent / 4)

            if (actualIndent === 0) {
                result.push(
                    new ParsedMdObj(
                        ['task-list', actualIndent, checkbox === '[x]'],
                        content
                    )
                )
                continue
            }

            const lastResult = result[result.length - 1]
            if (!lastResult) break taskListIf

            const lastType = lastResult.type[0]
            const lastIndent = lastResult.type[1]
            if (lastType == 'task-list' && actualIndent + 1 <= lastIndent) {
                result.push(
                    new ParsedMdObj(
                        ['task-list', actualIndent, checkbox === '[x]'],
                        content
                    )
                )

                continue
            }
        }

        const unorderedListRegex = /[-*+] {1,3}(?<content>.+)$/
        const unorderedListMatch = unorderedListRegex.exec(line)
        if (unorderedListMatch) {
            const indentCount = getIndentCount(
                line.slice(0, unorderedListMatch.index)
            )

            result.push(
                new ParsedMdObj(
                    [`unordered-list`, indentCount],
                    unorderedListMatch.groups.content
                )
            )
            continue
        }

        const footnoteDefinitionRegex =
            /^ {0,3}\[\^(?<name>.+)\]: {0,7}(?<content>.+)$/
        const footnoteDefinitionMatch = footnoteDefinitionRegex.exec(line)
        if (footnoteDefinitionMatch) {
            footnotes.push(
                new ParsedMdObj(
                    [
                        'footnote-definition',
                        footnoteDefinitionMatch.groups.name,
                    ],
                    footnoteDefinitionMatch.groups.content
                )
            )
            continue
        }

        result.push(new ParsedMdObj(['text'], line))
    }

    const genRegex = (
        patternName: string,
        char: string,
        times: number
    ): { pattern: RegExp; patternName: string } => {
        const pattern = new RegExp(
            `\\${char}{${times}}(?<content>\\${char}*[^${char}]+\\${char}*)\\${char}{${times}}`
        )

        return { pattern, patternName }
    }

    const textToMd = (text: string): ParsedMdObj[] => {
        let result: ParsedMdObj[] = [new ParsedMdObj(['regular-text'], text)]

        const patterns = [
            genRegex('bold-text', '*', 2),
            genRegex('italic-text', '*', 1),
            genRegex('highlight', '=', 2),
            genRegex('code', '`', 1),
            genRegex('strikethrough', '~', 2),
            genRegex('subscript', '~', 1),
            genRegex('superscript', '^', 1),
        ]
        for (const { pattern, patternName } of patterns) {
            for (let i = 0; i < result.length; i++) {
                let match = pattern.exec(result[i].content)
                if (!match) continue

                const [beforePattern, afterPattern] = result[i].content.split(
                    match[0]
                )
                let temp = [
                    new ParsedMdObj(['regular-text'], beforePattern),
                    new ParsedMdObj([patternName], match.groups.content),
                    new ParsedMdObj(['regular-text'], afterPattern),
                ]
                if (!beforePattern) temp.shift()
                if (!afterPattern) temp.pop()

                result.splice(i, 1, ...temp)
            }
        }

        const patterns2 = [
            {
                pattern:
                    /(?<!!)\[(?<content>.+)\]\((?<link>[^ "]+ ?)(?: "(?<title>.+)")?\)/,
                patternName: 'link',
            },
            {
                pattern:
                    /\[(?<content>.+)\]\((?<link>[^ "]+ ?)(?: "(?<title>.+)")?\)/,
                patternName: 'image',
            },
        ]
        for (const { pattern, patternName } of patterns2) {
            for (let i = 0; i < result.length; i++) {
                let match = pattern.exec(result[i].content)
                if (!match) continue

                const [beforePattern, afterPattern] = result[i].content.split(
                    match[0]
                )
                let temp = [
                    new ParsedMdObj(['regular-text'], beforePattern),
                    new ParsedMdObj(
                        [patternName, match.groups.link, match.groups.title],
                        match.groups.content
                    ),
                    new ParsedMdObj(['regular-text'], afterPattern),
                ]
                if (!beforePattern) temp.shift()
                if (!afterPattern) temp.pop()

                result.splice(i, 1, ...temp)
            }
        }

        const footnoteLinkRegex = /\[\^(?<name>.+)\]/
        for (let i = 0; i < result.length; i++) {
            const footnoteLinkMatch = footnoteLinkRegex.exec(result[i].content)
            if (!footnoteLinkMatch) continue

            const [beforePattern, afterPattern] = result[i].content.split(
                footnoteLinkMatch[0]
            )
            let temp = [
                new ParsedMdObj(['regular-text'], beforePattern),
                new ParsedMdObj(
                    ['link', '#' + footnoteLinkMatch.groups.name, undefined],
                    [
                        new ParsedMdObj(
                            ['superscript'],
                            `[${footnoteLinkMatch.groups.name}]`
                        ),
                    ]
                ),
                new ParsedMdObj(['regular-text'], afterPattern),
            ]
            if (!beforePattern) temp.shift()
            if (!afterPattern) temp.pop()

            result.splice(i, 1, ...temp)
        }

        return result
    }

    if (footnotes.length > 0) {
        if (result.length > 0) {
            result.push(new ParsedMdObj(['horizontal-rule'], ''))
        }

        for (const footnote of footnotes) {
            result.push(footnote)
        }
    }

    const addEmojis = (obj: ParsedMdObj): ParsedMdObj => {
        let content: ParsedMdObj['content']
        if (Array.isArray(obj.content)) {
            content = obj.content.map(addEmojis)
        } else {
            content = emojify(obj.content)
        }

        return { ...obj, content }
    }

    for (let res of result) {
        switch (res.type[0]) {
            case 'horizontal-rule':
            case 'table-divider':
            case 'code-block-start':
            case 'code-block-line':
            case 'code-block-end': {
                break
            }

            case 'table-header':
            case 'table-row': {
                for (let cell of res.content) {
                    cell.content = textToMd(cell.content).map(addEmojis)
                }
                break
            }

            default: {
                res.content = textToMd(res.content).map(addEmojis)
                break
            }
        }
    }

    return result
    // return [JSON.stringify(result)]
}
