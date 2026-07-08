import { PagePlaceholder } from '@/components/layout/page-placeholder'
interface Props { params: Promise<{ slug: string }> }
export default async function PodcastPage({ params }: Props) {
  const { slug } = await params
  return <PagePlaceholder title={`Podcast: ${slug}`} description="Audio player coming soon." icon="▶️" />
}
