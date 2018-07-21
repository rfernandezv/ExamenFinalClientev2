export class StudentDto {
    studentId: number;
    firstName: string;
    lastName: string;
    studentCode : string;
    typeGrade : string;
    amount : number;
    isActive : boolean;

    constructor() {}

    public setStudentId(value: number): StudentDto {
        this.studentId = value;
        return this;
    }

    public setFirstName(value: string): StudentDto {
        this.firstName = value;
        return this;
    }

    public setLastName(value: string): StudentDto {
        this.lastName = value;
        return this;
    }

    public setTypeGrade(value: string): StudentDto {
        this.typeGrade = value;
        return this;
    }

    public setStudentCode(value: string): StudentDto {
        this.studentCode = value;
        return this;
    }
    
    public setIsActive(value: boolean): StudentDto {
        this.isActive = value;
        return this;
    }

    public setAmount(value: number): StudentDto {
        this.amount = value;
        return this;
    }
}
