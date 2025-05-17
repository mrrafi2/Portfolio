import Nav from "./nav"

export default function Layout ({children} ) {

    return ( 
        <>
        <Nav/>
        
        <div style={{marginTop:'6rem'
        }}>
             {children}
        </div>
       
        </>
    )
}