import Link from 'next/link';

export default function QuestionNotFound() {
  return (
    <div className="py-24 text-center space-y-3">
      <h2 className="text-lg font-bold text-[var(--ink)]">Question not found</h2>
      <p className="text-sm text-[var(--ink-muted)]">This question may have been deleted or doesn't exist.</p>
      <Link href="/questions" className="text-xs text-[var(--accent)] hover:underline">← Back to Questions</Link>
    </div>
  );
}
