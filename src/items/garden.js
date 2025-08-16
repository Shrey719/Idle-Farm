import hay from "../images/wheat16.png"

//a simple garden
function garden() {
    return html`
        <h1>Garden</h1>
        <span>${window.gameState.garden.cost}<span>
    `
}

export default garden 