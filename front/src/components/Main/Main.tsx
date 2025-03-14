import './Main.css'

const Main: React.FC = () => {
  return (
    <main className='main-page'>
     <h1 className="main-main-label">ARIEL HAIR STYLE</h1> 
     <h4>ספר גברים, ניתן לקבוע תור כעת</h4>
     <a href='/Schedule' className='btn main-main-btn'>קבע תור</a>
    </main>
  );
};

export default Main;