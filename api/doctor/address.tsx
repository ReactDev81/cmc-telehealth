import api from "@/lib/axios";

export interface DoctorAddressPayload {
    address_line1: string;
    area: string;
    pincode: string;
    city: string;
    state: string;
    group: "address";
}

export const saveDoctorAddress = async ( doctorUsertID: string, payload: DoctorAddressPayload ) => {
    const { data } = await api.post(
        `/doctor/${doctorUsertID}`,
        payload
    );
    return data;
};