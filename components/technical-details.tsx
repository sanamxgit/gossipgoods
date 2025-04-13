export function TechnicalDetails() {
  return (
    <section className="container py-16 bg-gray-50">
      <h2 className="text-2xl font-bold mb-8">Technical Details:</h2>
      <div className="bg-white p-8 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Dimensions</h3>
              <p className="text-gray-600">H × W × D: 102 × 78 × 91 cm</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Weight</h3>
              <p className="text-gray-600">15.8 kg</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Materials</h3>
              <ul className="text-gray-600 list-disc list-inside">
                <li>Frame: Solid oak wood</li>
                <li>Upholstery: Premium textile</li>
                <li>Foam: High-density polyurethane</li>
              </ul>
            </div>
          </div>
          <div className="relative aspect-[2/1]">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7wwgwFiNiOVU98XI19D83u6hlnFcK2.png"
              alt="Technical Drawings"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
