export function ProductCollage() {
  return (
    <section className="container py-16">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="col-span-1 aspect-square">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NcPlIBWuP8F9RibsmPB9nIglrL9MGI.png"
            alt="The Reader Chair - Side View"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="col-span-1 aspect-square">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NcPlIBWuP8F9RibsmPB9nIglrL9MGI.png"
            alt="The Reader Chair - Upholstery Detail"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="col-span-1 aspect-square">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NcPlIBWuP8F9RibsmPB9nIglrL9MGI.png"
            alt="The Reader Chair - Material Detail"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="col-span-full aspect-video">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NcPlIBWuP8F9RibsmPB9nIglrL9MGI.png"
            alt="The Reader Chair - In Context"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  )
}
