import PropTypes from 'prop-types'
import React from "react"
import DownloadIcon from '@mui/icons-material/Download';
import { Card, Col, Row } from "reactstrap"
import DescriptionIcon from '@mui/icons-material/Description';
import { LoadingButton } from '@mui/lab';
import { formatDate } from '../../Validation&Formatation/formatation';

function CardShop({ item, api, loading }) {

  return (
    <>
      <Col xl="4" sm="6">
        <Card>
          <Row>
            <Col xl="5">
              <div className="text-center p-4 border-end">
                <div className="avatar-sm mx-auto mb-3 mt-1">
                  <DescriptionIcon sx={{ fontSize: 45 }}/>
                </div>
                <h5 className="text-truncate pb-1">{item.name}</h5>
              </div>
            </Col>

            <Col xl="7">
              <div className="p-4 text-center text-xl-start">
                <Row>
                  <Col xs="6">
                    <div>
                      <p className="text-muted mb-2 text-truncate">Tamanho</p>
                      <h5>{item.sizeFile}</h5>
                    </div>
                  </Col>
                  <Col xs="6">
                    <div>
                      <p className="text-muted mb-2 text-truncate">
                        Data
                      </p>
                      {/* <h5>{formatDate(item.date)}</h5> */}
                    </div>
                  </Col>
                </Row>
                <div className="flex w-full justify-end mt-4">
                  <LoadingButton
                    variant='contained'
                    size='small'
                    loading={loading}
                    onClick={() => api(item.identifier)}
                  >
                    Download
                    <DownloadIcon sx={{ fontSize: 18, marginLeft: 1 }}/>
                  </LoadingButton>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  )
}

CardShop.propTypes = {
  shop: PropTypes.object
}

export default CardShop
