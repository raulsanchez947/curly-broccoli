import { GetServerSideProps } from 'next'

export default function InstagramChatRedirect() {
  return null
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/contact',
    permanent: false,
  },
})
