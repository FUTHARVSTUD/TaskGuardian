export const GlobalState=(props) => { 
    const [state, setState] = useState({
        user: null,
        token: null,
    });
    
    return (
        <GlobalContext.Provider value={{ state, setState }}>
        {props.children}
        </GlobalContext.Provider>
    );
}