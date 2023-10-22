
class VacationsModel {
    public vacationId: number;
    public destination: string;
    public description: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public imageUrl: string; // Image url serving the uploaded image.
    public image: File; // Image file to upload to backend.
}

export default VacationsModel;