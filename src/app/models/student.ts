export class Student {
    studentId: number;
    firstName: string;
    lastName: string;
    studentCode : string;
    typeGrade : string;
    amount: number;
    isActive : boolean;

    constructor() {}

    public setStudentId(value: number): Student {
        this.studentId = value;
        return this;
    }

    public setFirstName(value: string): Student {
        this.firstName = value;
        return this;
    }

    public setLastName(value: string): Student {
        this.lastName = value;
        return this;
    }

    public setTypeGrade(value: string): Student {
        this.typeGrade = value;
        return this;
    }

    public setAmount(value: number): Student {
        this.amount = value;
        return this;
    }
    public setStudentCode(value: string): Student {
        this.studentCode = value;
        return this;
    }
    public setIsActive(value: boolean): Student {
        this.isActive = value;
        return this;
    }
}
