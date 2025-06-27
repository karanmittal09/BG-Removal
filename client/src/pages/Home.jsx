
import Header from '../components/Header'
import Steps from '../components/Steps'
import BgSlider from '../components/BgSlider'
import Testimonials from '../components/Testimonials'
import Upload from '../components/Upload'

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <Header/>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <Steps/>
      </section>

      {/* Demo Section */}
      <section className="py-16 bg-white">
        <BgSlider/>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <Testimonials/>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-fuchsia-500">
        <Upload/>
      </section>
    </div>
  )
}

export default Home