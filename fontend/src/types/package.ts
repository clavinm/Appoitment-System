export type Package = {
  name: string;
  price: number;
  invoiceDate: string;
  status: string;
};
export type AddDoctor = {
  username: string;
  email: string;
  specialist: string;
  dob: Date;
  gender: string;
  mobileNumber: string;
  address: string;
  password: string;
};

export type AdReceptionist = {
  username: string;
  email: string;
  dob: Date;
  gender: string;
  mobileNumber: string;
  address: string;
  password: string;
  doctor: string[];
};

export type AddPatient = {
  username: string;
  email: string;
  mobileNumber: string;
  dob: Date;
  gender: string;
  address: string;
};
