
import * as items from "../items/main.js"

function sideBar() {
    let mainCss = css`
        position: absolute;
        right: 0;
        height: 100vh;
        background-color: rgba(18, 70, 94, 1);
        width: 13vw;
        padding-left: 2vw;

        & h1 {
            color: white;
            font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
        }
    `
    return html`
    <div class=${mainCss}>
        <div>${items.garden()}</div>
        <div>${items.farmland()}</div>   
        <div>${items.biolab()}</div>      
        <div>${items.nuclear()}</div> 
        <div>${items.timemachine()}</div> 
        <div>${items.schrodinger()}</div>
    </div>`
}

export default sideBar;