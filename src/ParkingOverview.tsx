import * as React from "react";
import { Flight, ParkingArea, Aircraft, ParkingSpot } from "./parkingPlanningAPI";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { get, post } from "./util";

interface P { }

export default function ParkingOverview(props: P) {
    const [flights, setFlights] = React.useState<Flight[]>();
    const [parkingareas, setParkingAreas] = React.useState<ParkingArea[]>();
    const [totalavailablespace, setTotalAvailableSpace] = React.useState<number>();
    const [aircrafts, setAircrafts] = React.useState<Aircraft[]>();
    const [selectedParkingArea, setSelectedParkingArea] = React.useState<ParkingArea | undefined>();
    const [parkingSpots, setParkingSpots] = React.useState<ParkingSpot[]>();
    const [selectedFlight, setSelectedFlight] = React.useState('');
    const [startDate, setStartDate] = React.useState<Date | null>(null);

    React.useEffect(() => {
        get({
            handleDone: (r: Flight[]) => setFlights(r),
            handleFail: (r) => console.error(r),
            route: "flights",
        });
        get({
            handleDone: (r) => setParkingAreas(r),
            handleFail: (r) => console.error(r),
            route: "parkingareas",
        });
        get({
            handleDone: (r) => setAircrafts(r),
            handleFail: (r) => console.error(r),
            route: "aircrafts",
        });
        get({
            handleDone: (r: number) => setTotalAvailableSpace(r),
            handleFail: (r) => console.error(r),
            route: "ParkingAreas/total-available-space",
        });
    }, []);
    const handleParkingAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAreaName = event.target.value;
        const selectedArea = parkingareas?.find((area) => area.name === selectedAreaName);
        setSelectedParkingArea(selectedArea);
        setParkingSpots(selectedArea?.parkingSpots ?? []);
    };
    const handleFlightChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFlight(event.target.value);
    };
    const handleButtonClick = () => {
        post({
            handleDone: (r) => console.log(r),
            handleFail: (r) => console.error(r),
            route: "submit-data",
            data: {
                parkingArea: selectedParkingArea,
                inputData: inputData,
            },
        });
    };
    const alignLeft: React.CSSProperties = { textAlign: "left" };
    const alignRight: React.CSSProperties = { textAlign: "right" };
    return (
        <div className='dotted'>


            <label htmlFor="FlightSelect">Flights</label>
            <select id="FlightSelect" onChange={handleFlightChange}>
                <option value={""}>--Select a flight--</option>
                {flights?.map((p) => (
                    <option key={p.startDateTime} value={JSON.stringify(p)}>
                        {p.aircraft?.registrationCode}
                    </option>
                ))}
            </select>

            <label htmlFor="parkingAreaSelect">Parking Areas</label>
            <select id="parkingAreaSelect" onChange={handleParkingAreaChange}>
                <option value="">-- Select parking area --</option>
                {parkingareas?.map((area) => (
                    <option key={area.name} value={area.name ?? ''}>{area.name}</option>
                ))}
            </select>


            <label htmlFor="parkingSpotSelect">Parking Spots</label>
            <select id="parkingSpotSelect">
                <option value="">-- Select parking spot --</option>
                {parkingSpots?.map((spot) => (
                    <option key={spot.name} value={spot.name ?? ''}>{spot.name}</option>
                ))}
            </select>
            <label htmlFor="StartDate">Start Datetime</label>
            <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                placeholderText="Select date and time"
            />
            <button onClick={handleButtonClick}>Click me!</button>
        </div>
    );

}
