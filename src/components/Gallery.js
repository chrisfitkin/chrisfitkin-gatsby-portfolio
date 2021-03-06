import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Carousel, { Modal, ModalGateway } from 'react-images'
import Image from './Image'

class Gallery extends Component {
  constructor() {
    super()

    this.state = {
      lightboxIsOpen: false,
      selectedIndex: 0,
    }

    this.toggleLightbox = this.toggleLightbox.bind(this)
  }
  toggleLightbox(selectedIndex) {
    this.setState(state => ({
      lightboxIsOpen: !state.lightboxIsOpen,
      selectedIndex: selectedIndex,
    }))
  }
  renderGallery(projects, allImages) {
    if (!projects) return

    const gallery = projects.map((project, i) => {
      const { excerpt, frontmatter = {} } = project
      const { title /* , path, date, */, images } = frontmatter
      const image = images
        ? allImages.find(image => image.relativePath === images[0])
        : null
      return (
        <article className="6u 12u$(xsmall) work-item" key={i}>
          <div class="work-item-wrapper">
            <a
              className="work-item-link"
              href={image.publicURL || '#'}
              onClick={e => {
                e.preventDefault()
                this.toggleLightbox(i)
              }}
            >
              <div className="image fit thumb">
                {image ? (
                  <Image
                    className="image"
                    filename={image.relativePath}
                    alt={title}
                  />
                ) : null}
              </div>

              <div className="work-item-content">
                <h3>{title}</h3>
                <p>{excerpt}</p>
                <p>{images ? images[0] : null}</p>
              </div>
            </a>
          </div>
        </article>
      )
    })

    return <div className="row">{gallery}</div>
  }
  render() {
    const { allImages, projects } = this.props
    const { selectedIndex, lightboxIsOpen } = this.state
    const selectedProject = projects[selectedIndex]

    console.log('🧸 projects', projects)
    console.log('🧸 selectedProject', selectedProject)
    console.log('🧸 allImages', allImages)

    return (
      <div>
        {this.renderGallery(projects, allImages)}
        <ModalGateway>
          {lightboxIsOpen && (
            <Modal onClose={this.toggleLightbox}>
              <Carousel
                currentIndex={0}
                views={
                  selectedProject &&
                  selectedProject.frontmatter &&
                  selectedProject.frontmatter.images
                    ? selectedProject.frontmatter.images.map((image, i) => {
                        console.log(
                          'selectedProject.frontmatter.images.image',
                          image
                        )
                        return {
                          id: i,
                          source: allImages.find(allImage => {
                            return allImage.relativePath === image
                          }).publicURL,
                          thumbnail: allImages.find(
                            allImage => allImage.relativePath === image
                          ).childImageSharp.fluid.src,
                          caption: selectedProject.title,
                          description: selectedProject.excerpt,
                        }
                      })
                    : []
                }
              />
            </Modal>
          )}
        </ModalGateway>
      </div>
    )
  }
}

Gallery.displayName = 'Gallery'
Gallery.propTypes = {
  images: PropTypes.array,
}

export default Gallery
