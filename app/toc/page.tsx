export default function TermsOfConditions() {
	return (
		<div className="max-w-screen-xl mx-auto my-10 px-4 md:px-6 lg:px-8">
			<div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
				<h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Terms and Conditions</h1>
				<p className="text-gray-600 mb-8 text-center">
					Welcome to Talentank, a platform built to help you discover, develop, and demonstrate your talent in the most
					personalized way possible. We believe in full transparency. Below, you will find everything you need to know about how
					we handle your data and what it means to use our platform.
				</p>

				<div className="space-y-8">
					<section>
						<h2 className="text-2xl font-semibold text-blue-700 mb-3">1. Our Commitment to Your Privacy</h2>
						<p className="text-gray-700">
							At Talentank, we do not just talk about privacy—we practice it. We collect certain personal information such as your
							name, email address, and your responses to assessments to tailor your experience and provide meaningful insights that
							support your growth journey. We only collect what we need, and we never use your data for anything unrelated to your
							experience with us.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-blue-700 mb-3">2. How We Use Your Data</h2>
						<p className="text-gray-700 mb-3">We use the data you provide to:</p>
						<ul className="list-disc pl-6 text-gray-700 space-y-1">
							<li>Personalize your development or talent assessment experience</li>
							<li>Generate insights and recommendations tailored to your profile</li>
							<li>Communicate important updates, opportunities, or progress reports</li>
							<li>Improve the overall functionality and effectiveness of our platform</li>
						</ul>
						<p className="text-gray-700 mt-3">We do not sell your data to third parties. Your trust is non-negotiable.</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-blue-700 mb-3">3. How Your Data is Stored</h2>
						<p className="text-gray-700">
							Your data is stored using industry-standard security practices. We take appropriate technical and organizational
							measures to ensure that your personal information remains secure, confidential, and protected from unauthorized
							access. If we ever work with trusted partners to enhance your experience such as analytics or infrastructure
							providers, they are contractually bound to uphold strict data protection standards.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-blue-700 mb-3">4. Your Rights and Choices</h2>
						<p className="text-gray-700 mb-3">You remain in control of your data. At any point, you can:</p>
						<ul className="list-disc pl-6 text-gray-700 space-y-1">
							<li>Request access to the personal information we hold about you</li>
							<li>Ask us to correct or update inaccurate details</li>
							<li>Request that we delete your data permanently</li>
						</ul>
						<p className="text-gray-700 mt-3">
							All it takes is a simple email to our team at privacy@talentank.com and we will take care of the rest.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-blue-700 mb-3">5. Cookies and Tracking</h2>
						<p className="text-gray-700">
							To enhance your user experience, we may use cookies or similar technologies to analyze platform performance and
							understand how users interact with our services. You can choose to disable cookies in your browser settings, although
							it may impact some features.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-blue-700 mb-3">6. Consent and Use</h2>
						<p className="text-gray-700">
							By signing up for Talentank or continuing to use our services, you agree to these terms and acknowledge our approach
							to data collection, usage, and protection as described above. If you do not agree with any part of these terms, we
							advise you to discontinue use of the platform.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-blue-700 mb-3">7. Updates to This Policy</h2>
						<p className="text-gray-700">
							We may update these Terms and Conditions from time to time to reflect changes in law, technology, or our services.
							When we do, we will notify you on our platform or via email. We encourage you to review these terms regularly so you
							always know where we stand.
						</p>
					</section>
					<section>
						<h2 className="text-2xl font-semibold text-blue-700 mb-3">8. Entertainment Articles</h2>
						<p className="text-gray-600 mb-8">
							Talentank is also providing entertainment articles to keep you informed and engaged with the latest trends.
						</p>
					</section>
				</div>

				<div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100">
					<h2 className="text-2xl font-semibold text-blue-800 mb-3 text-center">Still have questions?</h2>
					<p className="text-gray-700 text-center">
						We are here to help. Reach out to us any time at{' '}
						<a href="mailto:support@talentank.com" className="text-blue-600 hover:underline">
							support@talentank.com
						</a>
					</p>
					<p className="text-gray-700 text-center mt-4 font-medium">Let us build a better future together.</p>
				</div>
			</div>
		</div>
	)
}
