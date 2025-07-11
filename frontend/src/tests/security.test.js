import userEvent from '@testing-library/user-event';
import AddCompanyDepartment from '../pages/company/AddCompanyDepartment';
import {screen, render} from '@testing-library/react'

describe('XXS prevention tests', ()=>{
    const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    'javascript:alert("XSS")',
    '<svg onload=alert("XSS")>',
    '<iframe src="javascript:alert(\'XSS\')"></iframe>'
  ];

  test('should sanitize user inputs in add department', async()=>{
    const user = userEvent.setup()

    for (const payload of xssPayloads){
        render (<AddCompanyDepartment/>)

        const input = screen.getByLabelText('Name')
        await user.type(input,payload)

        const submitButton = screen.getByRole('button',{name:/Add Department/i})
        await user.click(submitButton)

        expect(screen.queryAllByText(payload)).not.toBeInTheDocument()

        const scripts = document.querySelectorAll('script')
        const maliciousScripts = Array.from(scripts).find(script=> script.textContent.includes('alert("XSS")'))
        expect(maliciousScripts).toBeUndefined();

    }
  })
})