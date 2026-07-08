import { PagePlaceholder } from '@/components/layout/page-placeholder'
interface Props { params: Promise<{ username: string }> }
export default async function ProfilePage({ params }: Props) {
  const { username } = await params
  return <PagePlaceholder title={`@${username}`} description="User profile coming soon." icon="👤" />
}
