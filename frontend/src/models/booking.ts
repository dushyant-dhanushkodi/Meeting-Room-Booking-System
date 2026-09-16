export type BookingStatus = 'AVAILABLE' | 'BOOKED' | 'CANCELLED' | 'OVERRIDDEN';


 

export interface BookingDto {

  id?: number;

  roomId: number;

  userId: number;

  roomName?: string;

  username?: string;

  title: string;

  startTime: string;

  endTime: string;

  status?: BookingStatus;

}



 