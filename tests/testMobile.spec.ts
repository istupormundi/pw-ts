 import { test } from '@playwright/test'
 
 test('input fields', async({page}) => {
        await page.goto('/')
        await page.locator('.sidebar-toggle').click()
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
        await page.locator('.sidebar-toggle').click()

        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
        const inputEmail = page.locator('#inputEmail1')
        let exp = 'test2@test.com'

        await usingTheGridEmailInput.fill('test@test.com')
        await inputEmail.fill('dev@test.com')

        await inputEmail.clear()
        await inputEmail.pressSequentially(exp, {delay: 10})
    })
