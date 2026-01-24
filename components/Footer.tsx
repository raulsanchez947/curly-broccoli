export default function Footer(){
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto p-4 text-sm text-center text-gray-600">
        © {new Date().getFullYear()} Apartment Advisor — Learn and share about renting.
        <div className="mt-2 text-xs text-gray-500">Tips, sample leases, and local resources.</div>
      </div>
    </footer>
  )
}
