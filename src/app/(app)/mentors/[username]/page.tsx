import { PagePlaceholder } from '@/components/layout/page-placeholder'
interface Props { params: Promise<{ username: string }> }
export default async function MentorProfilePage({ params }: Props) {
  const { username } = await params
  return <PagePlaceholder title={`Mentor: @${username}`} description="Mentor profile, rates, and booking coming soon." icon="🌟" />
}
