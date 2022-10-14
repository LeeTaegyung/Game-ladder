import { Ladder } from "./ladder.js";

window.onload = () => {
    const ladder = new Ladder('.ladder', {
        maxPersonCount: 10,
    });
}