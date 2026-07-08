import { PagePlaceholder } from '@/components/layout/page-placeholder'
interface Props { params: Promise<{ username: string }> }
export default async function BookSessionPage({ params }: Props) {
  const { username } = await params
  return <PagePlaceholder title={`Book a Session with @${username}`} description="Session scheduling and payment coming soon." icon="📅" />
}
