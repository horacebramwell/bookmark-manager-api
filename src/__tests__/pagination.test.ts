import { type Request } from "express"
import { getPaginationOptions } from "../utils/pagination"

describe("Pagination Utility", () => {
  it("should return default pagination options when no query params are provided", () => {
    const req = {
      query: {},
    } as Request

    const options = getPaginationOptions(req)

    expect(options).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
    })
  })

  it("should return correct pagination options when query params are provided", () => {
    const req = {
      query: {
        page: "2",
        limit: "20",
      },
    } as unknown as Request

    const options = getPaginationOptions(req)

    expect(options).toEqual({
      page: 2,
      limit: 20,
      skip: 20,
    })
  })

  it("should handle invalid pagination params gracefully", () => {
    const req = {
      query: {
        page: "invalid",
        limit: "invalid",
      },
    } as unknown as Request

    const options = getPaginationOptions(req)

    expect(options).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
    })
  })
})
