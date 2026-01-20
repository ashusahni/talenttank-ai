import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { QuoteIcon } from 'lucide-react'

interface TestimonialCardProps {
	quote: string
	author: string
	role: string
	avatarSrc: string
}

export default function TestimonialCard({ quote, author, role, avatarSrc }: TestimonialCardProps) {
	return (
		<Card className="overflow-hidden">
			<CardContent className="p-6">
				<div className="flex flex-col gap-4">
					<QuoteIcon className="h-8 w-8 text-muted-foreground/50" />
					<p className="text-muted-foreground">{quote}</p>
					<div className="flex items-center gap-4 pt-4">
						<Avatar>
							<AvatarImage src={avatarSrc} alt={author} />
							<AvatarFallback>{author.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-semibold">{author}</p>
							<p className="text-sm text-muted-foreground">{role}</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
