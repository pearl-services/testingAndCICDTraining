import {describe, it, expect, vi, beforeEach} from 'vitest';
import { calculator } from './calculator'

describe.skip("Vitest Fundamental", () => {
    it("should add two numbers", () => {
        const result = calculator.add(3,5)
        expect(result).toBe(5)
    })
})
describe("Vitest Fundamentals", () => {
    beforeEach(()=>{
        vi.clearAllMocks()
        vi.resetAllMocks()
        vi.restoreAllMocks()
    })
    it("should add two numbers", () => {
       const result = calculator.add(2,3)
       expect(result).toBe(5)
    })
    it.skip("should add two numbers", () => {
       const result = calculator.add(4,3)
       expect(result).toBe(7)
    })

    //SPIES
    it ("shows how spies work", () => {
        const spy = vi.spyOn(calculator,"add")
        const result = calculator.add(2,3)
        expect(result).toBe(5)
        expect(spy).toHaveBeenCalledOnce()
        expect(spy).toHaveBeenCalledWith(2,3)
    })

    //MOCKING
    it ("shows how mocking works", () => {
        const spy = vi.spyOn(calculator,"add").mockReturnValue(5)
        const result = calculator.add(2,3) 
        expect(result).toBe(5)
        expect(spy).toHaveBeenCalledOnce()
        expect(spy).toHaveBeenCalledWith(2,3)
    })

    it("shows how pure mocks works", () => {
        const addMock= vi.fn().mockReturnValue(10)
        const result = addMock(5, 5)
        expect(result).toBe(10)
        expect(addMock).toHaveBeenCalledOnce()
        expect(addMock).toHaveBeenCalledWith(5,5)
    })

    it("shows how mock clearing works", () => {
        const spy = vi.spyOn(calculator,"add")
        const result = calculator.add(2,3) 
        expect(result).toBe(5)
        expect(spy).toHaveBeenCalledOnce()
        spy.mockClear()
        const result2 = calculator.add(3,3) 
        expect(result2).toBe(6)
        expect(spy).toHaveBeenCalledOnce()
    })

    it("shows how mock resetting works", () => {
        const spy = vi.spyOn(calculator,"add")
        const result = calculator.add(2,3) 
        expect(result).toBe(5)
        expect(spy).toHaveBeenCalledOnce()
        spy.mockReset()
        const result2 = calculator.add(3,3) 
        expect(result2).toBe(6)
        expect(spy).toHaveBeenCalledOnce()
    })

    it("shows how mock restoring works", () => {
        const spy = vi.spyOn(calculator,"add")
        const result = calculator.add(2,3) 
        expect(result).toBe(5)
        expect(spy).toHaveBeenCalledOnce()
        spy.mockRestore()
        const result2 = calculator.add(3,3) 
        expect(result2).toBe(6)
        expect(spy).toHaveBeenCalledTimes(0)
    })
}) 