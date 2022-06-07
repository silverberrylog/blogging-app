/// <reference types="cypress" />
import { markdownToJson } from '@/utils/markdown'

describe('Testing markdownToJson function', () => {
    describe('Parsing titles', () => {
        it('Should parse the titles that contain "Yes"', () => {
            const lines = [
                '# Yes',
                '## Yes',
                '### Yes',
                '#### Yes',
                '##### Yes',
                '###### Yes',
                ' ###### Yes',
                '  ###### Yes',
                '   ###### Yes',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
        })

        it('Should parse the titles with custom ids', () => {
            const lines = [
                '# Yes {#custom-id}',
                '## Yes {#custom-id}',
                '### Yes {#custom-id}',
                '#### Yes {#custom-id}',
                '##### Yes {#custom-id}',
                '###### Yes {#custom-id}',
                ' ###### Yes {#custom-id}',
                '  ###### Yes {#custom-id}',
                '   ###### Yes {#custom-id}',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)

            result.forEach(res => {
                expect(res.type[2]).to.eql('custom-id')
            })
        })

        it('Should not parse the titles that contain "No"', () => {
            const md = ['#No', '    ###### No', '\t###### No'].join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result.filter(it => it.type[0] === 'title')).to.have.length(
                0
            )
        })
    })

    describe('Parsing empty lines', () => {
        it('Should not return more than 1 empty line in a row', () => {
            const lines = ['     ', '']
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(1)
        })
    })

    describe('Parsing block quotes', () => {
        it('Should parse every block quote', () => {
            const lines = [
                '     > lorem ipsum',
                '>lorem ipsum',
                '        >       lorem ipsum',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
        })
    })

    describe('Parsing unordered lists', () => {
        it('Should parse an unordered list with no indent', () => {
            const lines = [
                '- Lorem ipsum',
                ' - Lorem ipsum',
                ' - Lorem ipsum',
                '- Lorem ipsum',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
        })

        it('Should parse an unordered list with indent', () => {
            const lines = [
                '  + Lorem ipsum',
                '    + Lorem ipsum',
                '\t  * Lorem ipsum',
                '\t\t* Lorem ipsum',
                '\t \t - Lorem ipsum',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
        })
    })

    describe('Parsing ordered lists', () => {
        it('Should parse an ordered list with no indent', () => {
            const lines = [
                '1. Lorem ipsum',
                ' 1. Lorem ipsum',
                ' 1. Lorem ipsum',
                '1. Lorem ipsum',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
        })

        it('Should parse an ordered list with indent', () => {
            const lines = [
                '  1. Lorem ipsum',
                '    1. Lorem ipsum',
                '\t  1. Lorem ipsum',
                '\t\t1. Lorem ipsum',
                '\t \t 1. Lorem ipsum',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
        })
    })

    describe('Parsing a table', () => {
        it('Should parse a table with no alignment', () => {
            const lines = [
                '|                Lorem ipsum header     | Lorem ipsum header |        ',
                '| - | ----------- |   ',
                '|         Lorem ipsum | Lorem ipsum |',
                '| Lorem ipsum | Lorem ipsum |',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
            expect(result[1].type[1]).to.deep.equal(['left', 'left'])
            result.forEach((line, index) => {
                if (index != 1) expect(line.content.length).to.eql(2)
            })
        })

        it('Should parse a table with alignment', () => {
            const lines = [
                '| Lorem ipsum header      | Lorem ipsum header | Lorem ipsum header    |',
                '| :---        |    :----:   |          ---: |',
                '| Lorem ipsum      | Lorem ipsum       | Lorem ipsum  |',
                '| Lorem ipsum   | Lorem ipsum        | Lorem ipsum      |',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
            expect(result[1].type[1]).to.deep.equal(['left', 'center', 'right'])
            result.forEach((line, index) => {
                if (index != 1) expect(line.content.length).to.eql(3)
            })
        })
    })

    describe('Parsing a code block', () => {
        it('Should parse a code block with json format', () => {
            const lines = [
                '``` json          ',
                '{',
                '    "firstName": "John",',
                '    "lastName": "Smith",',
                '    "age": 25',
                '}',
                '```  ',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
            expect(result[0].type[0]).to.eql('code-block-start')
            expect(result[result.length - 1].type[0]).to.eql('code-block-end')
        })

        it('Should parse a code block with no given format', () => {
            const lines = [
                '```           ',
                '{',
                '    "firstName": "John",',
                '    "lastName": "Smith",',
                '    "age": 25',
                '}',
                '```  ',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
            expect(result[0].type[0]).to.eql('code-block-start')
            expect(result[result.length - 1].type[0]).to.eql('code-block-end')
        })

        it('Should parse 2 code blocks with no given format', () => {
            const lines = [
                '```           ',
                '{',
                '    "firstName": "John",',
                '}',
                '```  ',

                '  ```  ',
                '{',
                '    "firstName": "John",',
                '}',
                '```  ',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)

            expect(result[0].type[0]).to.eql('code-block-start')
            expect(result[4].type[0]).to.eql('code-block-end')

            expect(result[5].type[0]).to.eql('code-block-start')
            expect(result[result.length - 1].type[0]).to.eql('code-block-end')
        })
    })

    describe('Parsing a definition list', () => {
        it('Should parse a simple list', () => {
            const lines = [
                'Term',
                '   :  Definition  ',
                ' \t:   Definition  ',
                '\t: Long definition  ',
                '\t\t:  Long definition  ',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
            expect(result[0].type[0]).to.eql('defined-term')
            result.slice(1).forEach(res => {
                expect(res.type[0]).to.eql('definition')
            })
        })
    })

    describe('Parsing a task list', () => {
        it('Should parse an non-indented list', () => {
            const lines = [
                '-    [x]      Checked',
                ' - [ ] Unchecked',
                '  - [ ] Unchecked',
                '   - [ ] Unchecked',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
            result.forEach(res => {
                expect(res.type[0]).to.eql('task-list')
            })
        })

        it('Should parse an indented list', () => {
            const lines = [
                '-    [x]      Checked',
                ' - [ ] Unchecked',
                '  - [ ] Unchecked',
                '   - [ ] Unchecked',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
            result.forEach(res => {
                expect(res.type[0]).to.eql('task-list')
            })
        })

        it('Should not parse a wrongly indented list', () => {
            const lines = ['\t\t- [x] No', '\t\t- [ ] No', '\t\t- [ ] No']
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
            expect(
                result.filter(res => res.type[0] === 'task-list')
            ).to.have.length(0)
        })
    })

    class Text {
        constructor(public textType: string, public separator: string) {}
    }
    const textTypes = [
        new Text('bold text', '**'),
        new Text('italic text', '*'),
        new Text('highlight', '=='),
        new Text('code', '`'),
        new Text('strikethrough', '~~'),
        new Text('subscript', '~'),
        new Text('superscript', '^'),
    ]

    for (const { textType, separator } of textTypes) {
        describe(`Parsing ${textType}`, () => {
            it(`Should parse ${textType} for simple text`, () => {
                const lines = [
                    `Normal text ${separator}${textType}${separator}, normal text again`,
                ]
                const md = lines.join('\n')

                const result = markdownToJson(md)
                cy.log(result)

                expect(result).to.have.length(lines.length)
                expect(result[0].type[0]).to.eql('text')
                expect(result[0].content).to.have.length(3)

                expect(result[0].content[0].type[0]).to.eql('regular-text')
                expect(result[0].content[1].type[0]).to.eql(
                    textType.replace(' ', '-')
                )
                expect(result[0].content[2].type[0]).to.eql('regular-text')
            })

            it(`Should parse ${textType} for a title`, () => {
                const lines = [
                    `# Normal title, ${separator}${textType}${separator}, normal text again`,
                ]
                const md = lines.join('\n')

                const result = markdownToJson(md)
                cy.log(result)

                expect(result).to.have.length(lines.length)
                expect(result[0].type[0]).to.eql('title')
                expect(result[0].content).to.have.length(3)

                expect(result[0].content[0].type[0]).to.eql('regular-text')
                expect(result[0].content[1].type[0]).to.eql(
                    textType.replace(' ', '-')
                )
                expect(result[0].content[2].type[0]).to.eql('regular-text')
            })

            it(`Should parse ${textType} for a table`, () => {
                const lines = [
                    `| Header1       | ${separator}${textType}${separator} |`,
                    `| :------------ | ----------------------------------: |`,
                    `| Regular text  | ${separator}${textType}${separator} |`,
                ]
                const md = lines.join('\n')

                const result = markdownToJson(md)
                cy.log(result)

                expect(result).to.have.length(lines.length)

                expect(result[0].type[0]).to.eql('table-header')
                expect(result[1].type[0]).to.eql('table-divider')
                expect(result[2].type[0]).to.eql('table-row')

                const textTypeWithHyphens = textType.replace(' ', '-')
                expect(result[0].content[1].content[0].type[0]).to.eql(
                    textTypeWithHyphens
                )
                expect(result[2].content[1].content[0].type[0]).to.eql(
                    textTypeWithHyphens
                )
            })
        })
    }

    describe('Parsing emojis', () => {
        it('Should parse text that contains emojis', () => {
            const lines = ['# Hello! :pizza:', 'Hello! :pizza:']
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
            result.forEach(result => {
                result.content.forEach(it => {
                    expect(it.content).to.contain('🍕')
                })
            })
        })

        it('Should parse a table that contains emojis', () => {
            const lines = [
                '| Header       | Header with emoji :pizza: |',
                '| ------------ | ------------------------- |',
                '| Regular text | Text with emoji :pizza:   |',
            ]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
            result.forEach((row, index) => {
                if (index == 1) return
                expect(row.content[1].content[0].content).to.contain('🍕')
            })
        })
    })

    describe('Parsing links', () => {
        it('Should parse a link', () => {
            const link =
                'My favorite search engine is [Duck Duck Go](https://duckduckgo.com "DuckDuckGo")'
            const lines = [`Lorem ipsum ${link}`, `# Lorem ipsum ${link}`]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
            result.forEach(res => {
                expect(res.content).to.have.length(2)
            })
        })
    })

    describe('Parsing images', () => {
        it('Should parse an image', () => {
            const image =
                '![The Mountains are beautiful](https://images.unsplash.com/photo-1654528255705-abd42012b849?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80 "Mountains")'
            const lines = [`Lorem ipsum ${image}`, `# Lorem ipsum ${image}`]
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
            result.forEach(res => {
                expect(res.content).to.have.length(2)
            })
        })
    })

    describe('Parsing footnotes', () => {
        it('Should parse a footnote with no text before', () => {
            const lines = ['[^1]: This is the footnote.']
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length)
            expect(result[0].type[0]).to.eql('footnote-definition')
            expect(result[0].type[1]).to.eql('1')
            expect(result[0].content[0].content).to.eql('This is the footnote.')
        })

        it('Should parse a footnote with text before', () => {
            const lines = ['Lorem ipsum', '[^1]: This is the footnote.']
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length + 1)

            expect(result[0].type[0]).to.eql('text')
            expect(result[1].type[0]).to.eql('horizontal-rule')
            expect(result[2].type[0]).to.eql('footnote-definition')
        })

        it('Should parse text with footnote links', () => {
            const lines = ['Lorem ipsum [^1]', '[^1]: This is the footnote.']
            const md = lines.join('\n')

            const result = markdownToJson(md)
            cy.log(result)

            expect(result).to.have.length(lines.length + 1)

            expect(result[0].type[0]).to.eql('text')
            expect(result[0].content[0].type[0]).to.eql('regular-text')
            expect(result[0].content[0].content).to.eql('Lorem ipsum ')

            expect(result[0].content[1].type[0]).to.eql('link')
            expect(result[0].content[1].content[0].type[0]).to.eql(
                'superscript'
            )
            expect(result[0].content[1].content[0].content).to.eql('[1]')

            expect(result[1].type[0]).to.eql('horizontal-rule')
            expect(result[2].type[0]).to.eql('footnote-definition')
        })
    })
})
