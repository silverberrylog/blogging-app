import 'scss-reset/_reset.scss'
import '@/styles/App.scss'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingPage from '@/pages/Loading'

const HomePage = lazy(() => import('@/pages/Home'))
const BlogPage = lazy(() => import('@/pages/Blog'))
const CreateBlogPage = lazy(() => import('@/pages/CreateBlog'))
const NotFoundPage = lazy(() => import('@/pages/NotFound'))

export default function App() {
    return (
        <Suspense fallback={<LoadingPage />}>
            <BrowserRouter>
                <Header />
                <main className="page-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/blog/create"
                            element={<CreateBlogPage />}
                        />
                        <Route path="/blog/:blogId" element={<BlogPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        </Suspense>
    )
}
