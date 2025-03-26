import './Main.css'

const Main: React.FC = () => {
  return (
    <main className='main-page' style={{display:"flex",flexDirection:"column",gap:"24px"}}>
      <h1 className='main-main-label'>ARIEL HAIR STYLE</h1>
      <h4>ספר גברים, ניתן לקבוע תור כעת</h4>
      <a href='/Schedule' className='btn main-main-btn'>
        קבע תור
      </a>
      <a href='/admin' className='btn main-main-btn'>
       Admin
      </a>
    </main>
  );
};

export default Main;