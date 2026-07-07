import {test, expect} from '@playwright/test'

/*
test.beforeAll(async () => {
    console.log('before all')
}
)

test.afterEach(async () => {
    console.log('after each')
}
) 
*/

test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200/') //await потомучто goto асинхронная функция, которая возвращает промис. И мы должны дождаться его выполнения, прежде чем продолжать выполнение теста
    console.log('BEFORE EACH')
})

// Группировка тестов в тестовый сьют. Внутри тестового сьюта можно создавать тесты и другие тестовые сьюты. 
test.describe('suite 1', () => {

    test.beforeEach(async ({page}) => {
        await page.getByText('Forms').click() //находим элемент по тексту и кликаем на него
    })

    test('navigate to Form Layouts', async ({page}) => {
        await page.getByText('Form Layouts').click() 
    })

    test('navigate to Datepicker', async ({page}) => {
        await page.getByText('Datepicker').click() 
    })
})

test.describe('suite 2', () => {

    test.beforeEach(async ({page}) => {
        await page.getByText('Charts', { exact: true }).click() //находим элемент по тексту и кликаем на него
    })

    test('navigate to Echarts', async ({page}) => {
        await page.getByText('Echarts').click() 
    })
})