import '@styles/globals.css';
import Nav from '@components/Nav';
import Provider from '@components/Provider';

export const metadata ={
    title: 'PromptMania',
    description:'Discover and share Prompt for user interaction'

}

const RootLayout = ({children}) => {
  return (
    <html lang="en">
        <Provider>
        <body>
            <div className="main">
                <div className="gradient"></div>
            </div>
                 <main className="app">
                <Nav/>
                {children}
                </main>
        </body>
    </Provider>
   
    </html>
  )
}

export default RootLayout;
