export interface FilterCriteria {
    role?: string;
    _id?:{$in:string[]};
    $or?: { [key: string]: { $regex: string; $options: string } }[];
    experience?: { $gte?: string; $lte?: string };
    skills?: { $all: string[] };
    hourlyRate?: { $gte?: number; $lte?: number }; 
    category?: string;
    minRate?: { $gte?: number };
    maxRate?: { $lte?: number };
    timeline?: { $gt?: string }; 
    projectName?: { $regex: string; $options: string }; 
    text?: { $regex: string; $options: string }; 
  }
  