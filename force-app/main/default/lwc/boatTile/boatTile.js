import { api, LightningElement, wire } from 'lwc';
const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { MessageContext, publish } from 'lightning/messageService';

export default class BoatTile extends LightningElement {
    @wire(MessageContext)
    messageContext;
    @api boat;
    @api selectedBoatId;
    
    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() {
        return `background-image:url('${this.boat.Picture__c}')`;
    }

    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() {
        if (this.boat.Id == this.selectedBoatId) {
            return TILE_WRAPPER_SELECTED_CLASS;
        }
        return TILE_WRAPPER_UNSELECTED_CLASS;
    }

    // Fires event with the Id of the boat that has been selected.
    selectBoat() {
        this.selectedBoatId = this.boat.Id;
        this.dispatchEvent(
            new CustomEvent('boatselect',
                {
                    detail:
                        { boatId: this.selectedBoatId }
                }));

        const message = {
            recordId:this.selectedBoatId
        };
        
        publish(this.messageContext, BOATMC, message);
    }
}