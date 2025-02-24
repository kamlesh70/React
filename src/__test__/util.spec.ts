import { sortByAge } from "../util/sortFunctions";

describe("Testing sortByAge function after sorting", () => {
  const arr = [
    { name: "max", age: 12 },
    { name: "jake", age: 23 },
    { name: "james", age: 4 },
  ];

  it("should not be undefined", () => {
    expect(sortByAge(arr)).not.toBeUndefined();
  })

  it("length should be equal to 3", () => {
    expect(sortByAge(arr).length).toBe(3);
  })

  it("first element should be james", () => {
    expect(sortByAge(arr)[0].name).toBe("james");
  })
})