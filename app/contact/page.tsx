export default function Contact() {
	return (
		<div className="max-w-screen-xl mx-auto my-10 px-4 md:px-8">
			<div className="bg-white shadow-md rounded-lg p-6 md:p-8">
				<h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>

				<div className="max-w-2xl mx-auto">
					<div className="text-center mb-8">
						<p className="text-gray-700 text-lg mb-6">
							Got questions, feedback, or need help? Our team is here to assist you. Feel free to reach out through any of the
							following channels.
						</p>
					</div>

					<div className="space-y-6">
						<div className="flex items-center">
							<div className="bg-gray-100 p-3 rounded-full mr-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-gray-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									/>
								</svg>
							</div>
							<div>
								<h3 className="font-medium text-gray-900 text-lg">Phone</h3>
								<p className="text-gray-700">
									<a href="tel:+919004782037" className="hover:text-gray-900">
										+91-9004782037
									</a>
								</p>
							</div>
						</div>

						<div className="flex items-center">
							<div className="bg-gray-100 p-3 rounded-full mr-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-gray-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<div>
								<h3 className="font-medium text-gray-900 text-lg">Email</h3>
								<p className="text-gray-700">
									<a href="mailto:Support@talentank.in" className="hover:text-blue-800/80 text-blue-800">
										Support@talentank.in
									</a>
								</p>
							</div>
						</div>

						<div className="flex items-center">
							<div className="bg-gray-100 p-3 rounded-full mr-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-gray-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div>
								<h3 className="font-medium text-gray-900 text-lg">Support Hours</h3>
								<p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
							</div>
						</div>
					</div>

					<div className="mt-10 text-center">
						<p className="text-gray-700">We aim to respond to all inquiries within 24 hours during business days.</p>
					</div>
				</div>
			</div>
		</div>
	)
}
