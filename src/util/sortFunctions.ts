export type UserDetails = {
  name: string;
  age: number;
}

export const sortByAge = (arr: UserDetails[]) => {
  return arr.sort((a, b) => {
    return a.age - b.age;
  })
};