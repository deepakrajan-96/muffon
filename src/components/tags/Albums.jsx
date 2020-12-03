import React from 'react'
import axios from 'axios'
import ErrorMessage from 'partials/ErrorMessage'
import { Segment, Header } from 'semantic-ui-react'
import AlbumsData from './albums/AlbumsData'

export default class Albums extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { loading: false }
  }

  componentDidMount () {
    this._isMounted = true
    this.request = axios.CancelToken.source()

    this.getData()
  }

  componentWillUnmount () {
    this._isMounted = false
    this.request.cancel()
  }

  getData = page => {
    const switchLoader = loading => {
      this._isMounted && this.setState({ ...{ loading } })
    }

    switchLoader(true)

    const tagNameEncoded = encodeURIComponent(this.props.tagName)
    const url = `/lastfm/tags/${tagNameEncoded}/albums`
    const params = { ...{ page } }
    const cancelToken = this.request.token
    const extra = { ...{ params, cancelToken } }

    const handleSuccess = resp => {
      const { tag } = resp.data

      const albums = tag.albums
      const totalPages = tag.total_pages
      const currentPage = tag.page
      const error = null

      this.setState({ ...{ albums, totalPages, currentPage, error } })
    }

    const handleError = error => {
      const albums = null

      !axios.isCancel(error) && this.setState({ ...{ albums, error } })
    }

    const handleFinish = () => switchLoader(false)

    axios
      .get(url, extra)
      .then(handleSuccess)
      .catch(handleError)
      .then(handleFinish)
  }

  albumsData () {
    const { albums, totalPages, currentPage, loading } = this.state
    const { scrollToTop } = this.props
    const { getData } = this

    const albumsDataProps = {
      albums,
      totalPages,
      currentPage,
      getData,
      loading,
      scrollToTop
    }

    return <AlbumsData {...albumsDataProps} />
  }

  render () {
    const { albums, error, loading } = this.state

    const headerData = <Header as="h3" content="Top albums" />

    const albumsData = albums && this.albumsData()

    const errorData = error && <ErrorMessage {...{ error }} />

    const contentData = albumsData || errorData

    return (
      <Segment.Group className="tagsPageSegmentWrap">
        <Segment content={headerData} />
        <Segment
          className="tagsPageSegment"
          content={contentData}
          {...{ loading }}
        />
      </Segment.Group>
    )
  }
}
