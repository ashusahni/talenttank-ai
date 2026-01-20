export default function CancellationRefundPolicy() {
	return (
		<div className="max-w-screen-xl mx-auto my-10 px-4 md:px-8">
			<div className="bg-white shadow-md rounded-lg p-6 md:p-8">
				<h1 className="text-3xl font-bold text-center mb-8">Cancellation and No Refund Policy</h1>

				<div className="mb-6">
					<p className="text-gray-700 mb-4">
						Thank you for choosing Talentank. We value your trust and are committed to delivering a high-quality experience.
					</p>
					<p className="text-gray-700 font-medium">
						Please read our cancellation and refund policy carefully before making a payment.
					</p>
				</div>

				<div className="space-y-6">
					<section>
						<h2 className="text-xl font-semibold mb-3">1. No Cancellations</h2>
						<p className="text-gray-700">
							Once a subscription, assessment, or service has been purchased through Talentank, it cannot be cancelled. Please
							ensure that you review all details and service descriptions before proceeding with payment.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold mb-3">2. No Refunds</h2>
						<p className="text-gray-700 mb-3">
							All payments made on Talentank are final and non-refundable. We do not offer refunds for any reason, including but not
							limited to:
						</p>
						<ul className="list-disc pl-6 text-gray-700 space-y-1">
							<li>Unused assessments or services</li>
							<li>User dissatisfaction</li>
							<li>Accidental purchases</li>
							<li>Change of mind</li>
						</ul>
					</section>

					<section>
						<h2 className="text-xl font-semibold mb-3">3. Exceptions</h2>
						<p className="text-gray-700">
							Refunds will only be considered under exceptional circumstances, such as duplicate payments or proven technical issues
							resulting in non-delivery of services. Such requests must be made in writing within 3 days of the transaction, and
							eligibility will be determined at Talentank&apos;s sole discretion.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold mb-3">4. Chargebacks and Disputes</h2>
						<p className="text-gray-700">
							Initiating chargebacks through your bank or card issuer without contacting us first may result in permanent suspension
							of your Talentank account. We encourage you to reach out to our support team at{' '}
							<a href="mailto:Support@talentank.in" className="text-blue-600 hover:underline">
								Support@talentank.in
							</a>
							if you face any issues.
						</p>
					</section>
					<section>
						<h2 className="text-xl font-semibold mb-3">5. Refund Policy</h2>
						<p className="text-gray-700">
							All Refunds will be Processed & Credited to original Payment Mode within 6 to 8 business days.
						</p>
					</section>
				</div>

				<div className="mt-8 border-t pt-6">
					<p className="text-gray-700 font-medium">
						By completing your purchase on Talentank, you acknowledge that you have read, understood, and agreed to this policy.
					</p>
				</div>
			</div>
		</div>
	)
}
