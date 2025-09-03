import Nav from "./nav"

export default function Layout ({children} ) {

    return ( 
        <>
        <Nav/>
        
        <div style={{marginTop:'5rem'
        }}>
             {children}
        </div>

     
        </>
    )
}