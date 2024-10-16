export interface TypeState {
    user?: any;
    load?: boolean;
    courseCategory?: any;
    courseList?: any;
    myCourseList?: any;
    loading: string;
    error: string;
}

export interface ReducerType {
    TestSlice: TypeState;
}
