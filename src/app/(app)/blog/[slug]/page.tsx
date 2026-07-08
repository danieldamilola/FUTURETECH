import { PagePlaceholder } from '@/components/layout/page-placeholder'

interface Props { params: Promise<{ slug: string }> }

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  return <PagePlaceholder title={`Article: ${slug}`} description="Full article content coming soon." icon="📄" />
}
