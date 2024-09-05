import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';
import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class BoatSearchForm extends LightningElement {
    selectedBoatTypeId='';
    error = undefined;
    @track searchOptions=[{label:'All Types',value:''}];
    @wire(getBoatTypes)
    getWiredBoatTypes({data,error}){
       if(data){
        const boatTypes = data.map((boat) => {
            return { label: boat.Name, value: boat.Id };
        });
        this.searchOptions = [...this.searchOptions, ...boatTypes];
       }
       else if(error){
        this.showToast(error.body.message,'error');
        this.searchOptions = [];
        this.error = error;
       }
    }
    

   
    handleSearchOptionChange(event){
        this.selectedBoatTypeId = event.detail.value;
        const searchBoatTypesById=new CustomEvent('search',{
            detail: {boatTypeId:this.selectedBoatTypeId}
        });
        this.dispatchEvent(searchBoatTypesById);
    }

    showToast(errorMsg,variant) {
        const event = new ShowToastEvent({
            message: errorMsg,
            variant:variant
        });
        this.dispatchEvent(event);
    }
    
}