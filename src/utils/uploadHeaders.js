
import { getToken } from '@/utils/auth'

export default {
  computed: {
    header_token() {    // 此处命名不能为 headers , 否则则会报错
      return {
        'Authorization': 'Bearer ' + getToken()
      }
    }
  }
}
