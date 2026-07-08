import { PagePlaceholder } from '@/components/layout/page-placeholder'
interface Props { params: Promise<{ id: string }> }
export default async function QuestionPage({ params }: Props) {
  const { id } = await params
  return <PagePlaceholder title={`Question #${id}`} description="Full question thread coming soon." icon="💬" />
}
