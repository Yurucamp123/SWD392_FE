import { redirect } from 'react-router-dom'
import Cookies from 'js-cookie'

export function action() {
    // Xóa các cookies thay vì localStorage
    Cookies.remove('userInfo', { secure: true, sameSite: 'Strict' })
    Cookies.remove('token', { secure: true, sameSite: 'Strict' })
    Cookies.remove('expiration', { secure: true, sameSite: 'Strict' })

    // Redirect đến trang đăng nhập
    return redirect('/auth/signin')
}
