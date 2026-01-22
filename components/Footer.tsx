export default function Footer(){
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto p-4 text-sm text-center text-gray-600">
        © {new Date().getFullYear()} Apartment Advisor — Learn, share, and chat about renting.
      </div>
    </footer>
  )
}
