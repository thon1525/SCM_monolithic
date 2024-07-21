export interface IQueryParams {
  [key: string]: any;
}

export interface IRegex {
  $regex: string;
  $options: "i";
}

export interface IAdvanceSearch {
  start_date: string;
  end_date: string;
}

export interface IAdvanceSearchQuery {
  $or: Array<{
    [key: string]: {$gte: Date} | {$lte: Date}
  }>;
}

export interface SearchQuery {
  $or: Array<{
    [key: string]: IRegex;
  }>;
}
