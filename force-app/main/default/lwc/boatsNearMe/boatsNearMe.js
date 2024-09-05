import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { api, LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const LABEL_YOU_ARE_HERE = "You are here!";
const ICON_STANDARD_USER = "standard:user";
const ERROR_TITLE = "Error loading Boats Near Me";
const ERROR_VARIANT = "error";
export default class BoatsNearMe extends LightningElement {
    @api boatTypeId;
    isRendered = false;
    @track boats=[];
    latitude;
    longitude;
    isLoading=false;
   
    error = undefined;
    mapMarkers = [];

    @wire(getBoatsByLocation,{latitude:'$latitude',longitude:'$longitude',boatTypeId:'$boatTypeId'})
    wiredBoatsJSON({data,error}){
        this.isLoading = true;
        if(data){
            this.error = undefined;
            this.boats=JSON.parse(data);
            this.createMapMarkers(this.boats);
            this.isLoading = false;
        }
        else if(error){
            this.error = error;
            this.boats = undefined;
            this.mapMarkers = [];
            this.dispatchEvent(
                new ShowToastEvent({
                title: ERROR_TITLE,
                message: error.body.message,
                variant: ERROR_VARIANT
                }));
                this.isLoading = false;
        }
    }

    getLocationFromBrowser() {
        navigator.geolocation.getCurrentPosition(
             (position) => {
                  this.latitude = position.coords.latitude;
                  this.longitude = position.coords.longitude;
                },
             (e) => {
        
              }, 
              {
                   enableHighAccuracy: true
              }
        );
    }
        
    

    createMapMarkers(boatData) {
        console.log(typeof boatData);
        
        this.mapMarkers = boatData.map(rowBoat => {
                          return {
                                location: {
                                   Latitude: rowBoat.Geolocation__Latitude__s,
                                   Longitude: rowBoat.Geolocation__Longitude__s
                                 },
                             title: rowBoat.Name,
                            };
                         });
                         console.log( this.mapMarkers);
                         
        this.mapMarkers.unshift({
                        location: {
                          Latitude: this.latitude,
                          Longitude: this.longitude
                       },
                        title: LABEL_YOU_ARE_HERE,
                        icon: ICON_STANDARD_USER
                      });
       
        }

    renderedCallback() {
        if (this.isRendered == false) {
             this.getLocationFromBrowser();
        }
              this.isRendered = true;
        }

    

    
}